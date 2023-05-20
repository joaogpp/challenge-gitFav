import { GithubUser } from "./githubUsers.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem(`@github-favorites:`, JSON.stringify(this.entries))
  }

  delete(username){ 
    const filteredEntries = this.entries.filter(entry => entry.login !== username.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  } 

  async add(username) {
    
    try {
      const userExists = this.entries.find(entry => entry.login.toLowerCase() == username.toLowerCase())
      if(userExists) {
        throw new Error(`Usuario ja cadastrado`)
      } 
      const user = await GithubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error(`Usuario nao encontrado`)
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }

  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    
    this.tbody = document.querySelector('table tbody')
    this.update()
    this.onAdd()
  }

  onAdd() {
    const button = this.root.querySelector('.search button')
    button.addEventListener('click', () => {
      const { value } = this.root.querySelector('.search input')
      
      this.add(value)
    })
  }
  
  update() {
      this.removeAllTr()

      if(this.entries.length == 0) {
      const tr = document.createElement(`tr`)
      tr.classList.add('first')
      tr.innerHTML = `
      <td colspan="4">
            <div class="empty">
              <img src="./images/bg-star.svg" alt="">
              <p>Nenhum favorito ainda</p>
            </div>
          </td>
      `
      this.tbody.append(tr)

    }

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(`.user img`).src = `https://github.com/${user.login}.png`
      row.querySelector(`.user a`).href = `https://github.com/${user.login}`
      row.querySelector(`.user a p`).textContent = user.name
      row.querySelector(`.user a span`).textContent = user.login
      row.querySelector(`.repositories`).textContent = user.public_repos
      row.querySelector(`.followers`).textContent = user.followers

      row.querySelector(`.remove`).addEventListener('click', () => {
        const isOk = confirm(`Deseja realmente remover essa linha?`)

        if(isOk) {
          this.delete(user)
        }
      })

      this.tbody.append(row)
    
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://www.github.com/diego3g.png" alt="">
          <a href="">
            <p>Diego Fernandes</p>
            <span>/diego3g</span>
          </a>
      </td>
      <td class="repositories">
        123
      </td>
      <td class="followers">
        1234
      </td>
      <td class="remove">
        Remover
      </td>`
      
      return tr
  }

  removeAllTr() {
    const trs = this.tbody.querySelectorAll('tr')
    trs.forEach((tr) => {
      tr.remove()
    })
  }
}