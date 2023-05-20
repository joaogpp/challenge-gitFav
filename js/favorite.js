export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.tbody = document.querySelector('table tbody')
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.update()
  }

  update() {

    this.removeAllTr()

    this.tbody.append(this.createRow())
    this.tbody.append(this.createRow())
    this.tbody.append(this.createRow())
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
    trs.forEach((user) => {
      user.remove()
    })
  }
}