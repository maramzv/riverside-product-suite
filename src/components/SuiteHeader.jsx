export default function SuiteHeader({ product }) {
  return (
    <div className="rb-suiteheader">
      <div className="rb-suiteheader__brand">
        <img src={product.headerWordmark} alt={`${product.name} — ${product.tagline}`} />
      </div>
      <div className="rb-suiteheader__hint">
        Live deployment — this product's own navigation appears below
      </div>
    </div>
  )
}
