import { GithubUser } from "./gituser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@github-favorites')) || []
  }

  save() {
    localStorage.setItem('@github-favorites', JSON.stringify(this.users))
  }

  async add(username) {
    try {
      const userExist = this.users.find(data => data.login === username)

      if(userExist) {
        throw new Error('Usuario já existe')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Úsuario não existe')
      }

      this.users = [user, ...this.users]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  removeUser(user) {
    const filteredUser = this.users
      .filter(userData => userData.login !== user.login)

    this.users = filteredUser
    this.update()
    this.save()
  }
}

export class FavoritesViews extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      const input = this.root.querySelector('.search input')

      input.value = ''
      this.add(value)
    }
  }
  
  update() {
    this.removeAllTr()

    if(!this.users.length) {
      const row = this.showNoHasTr()

      this.tbody.append(row)
    }

    this.users.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem do ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover este usuario?')

        if (isOk) {
          this.removeUser(user)
        }
      }

      this.tbody.append(row)
    })
  }

  showNoHasTr() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td colspan="4" class="noFav">
        <div class="notFav">
          <img src="./assets/Estrela.png " alt="">
          <h1>Nenhum favorito ainda</h1>
        </div>
      </td>
    `
    return tr
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/diegodkid.png" alt="">  
        <a href="">
          <p>Diego Santos</p>
          <span>/diegodkig</span>
        </a>
      </td>
      <td class="repositories">
        55
      </td>
      <td class="followers">
        77
      </td>
      <td>
        <button class="remove">remover</button>
      </td>`

      return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach(tr => tr.remove())
  }
 
}