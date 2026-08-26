import { products, productOrder } from '../config/products'

export default function Sidebar({ activeKey, onSelect, collapsed, onToggleCollapse }) {
  const groups = ['Customer', 'Staff']

  return (
    <nav
      className={`rb-rail${collapsed ? ' rb-rail--collapsed' : ''}`}
      aria-label="Riverside Books"
    >
      <button
        type="button"
        className={`rb-rail__cap${activeKey === 'home' ? ' rb-rail__cap--active' : ''}`}
        onClick={() => onSelect('home')}
        aria-current={activeKey === 'home' ? 'page' : undefined}
        title={collapsed ? 'Riverside Books — Home' : undefined}
      >
        <img className="rb-lockup__icon" src="/brand/suite/riverside-books-icon.png" alt="Riverside Books" />
        {!collapsed && (
          <div className="rb-lockup__text">
            <div className="rb-lockup__name">RIVERSIDE BOOKS</div>
            <div className="rb-lockup__tagline">Independent &amp; Local</div>
          </div>
        )}
      </button>

      <div className="rb-rail__body">
        {groups.map((group) => (
          <div className="rb-navgroup" key={group}>
            {!collapsed && <div className="rb-navgroup__label">{group}</div>}
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
                    title={collapsed ? product.name : undefined}
                    onClick={() => onSelect(key)}
                  >
                    <img className="rb-navitem__icon" src={product.icon} alt={collapsed ? product.name : ''} />
                    {!collapsed && (
                      <div className="rb-navitem__text">
                        <div className="rb-navitem__name">{product.name}</div>
                        <div className="rb-navitem__sub">{product.tagline}</div>
                      </div>
                    )}
                  </button>
                )
              })}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="rb-rail__toggle"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        aria-expanded={!collapsed}
      >
        <span className="rb-rail__toggle-arrow">{collapsed ? '›' : '‹'}</span>
      </button>
    </nav>
  )
}
