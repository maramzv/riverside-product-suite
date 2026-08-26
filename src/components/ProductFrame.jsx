export default function ProductFrame({ product }) {
  return (
    <iframe
      key={product.key}
      className="rb-productframe"
      src={product.url}
      title={product.name}
      allow="clipboard-write"
    />
  )
}
