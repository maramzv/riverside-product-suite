export default function ProductFrame({ product }) {
  const crop = product.sidebarCropPx || 0

  return (
    <div className="rb-framecrop">
      <iframe
        key={product.key}
        className="rb-productframe"
        style={{
          left: `-${crop}px`,
          width: `calc(100% + ${crop}px)`,
        }}
        src={product.url}
        title={product.name}
        allow="clipboard-write"
      />
    </div>
  )
}
