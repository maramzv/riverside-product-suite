import { products, productOrder } from '../config/products'

export default function Sidebar({ activeKey, onSelect }) {
  const groups = ['Customer', 'Staff']

  return (
    <nav className="rb-rail" aria-label="Riverside Books">
      <div className="rb-rail__cap">
        <img className="rb-lockup__icon" src="/brand/suite/riverside-books-icon.png" alt="Riverside Books" />
        <div className="rb-lockup__text">
          <div className="rb-lockup__name">RIVERSIDE BOOKS</div>
          <div className="rb-lockup__tagline">Independent &amp; Local</div>
        </div>
      </div>

      <div className="rb-rail__body">
        {groups.map((group) => (
          <div className="rb-navgroup" key={group}>
            <div className="rb-navgroup__label">{group}</div>
            {productOrder
              .filter((key) => products[key].group === group)
              .map((key) => {
                const product = products[key]
                const isActive = key === activeKey
                return (
                  <button
                    key={key}
                    type="button"
                    className="rb-navitem"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onSelect(key)}
                  >
                    <img className="rb-navitem__icon" src={product.icon} alt="" />
                    <div className="rb-navitem__text">
                      <div className="rb-navitem__name">{product.name}</div>
                      <div className="rb-navitem__sub">{product.tagline}</div>
                    </div>
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </nav>
  )
}
