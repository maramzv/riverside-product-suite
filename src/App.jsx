import { useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import ProductFrame from './components/ProductFrame'
import Presentation from './components/Presentation'
import { products } from './config/products'

export default function App() {
  const [activeKey, setActiveKey] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const hasAutoCollapsed = useRef(false)
  const product = products[activeKey]

  const handleSelect = (key) => {
    setActiveKey(key)
    // First time the user opens an actual app, collapse the rail for max viewport.
    if (key !== 'home' && !hasAutoCollapsed.current) {
      hasAutoCollapsed.current = true
      setCollapsed(true)
    }
  }

  return (
    <div className="rb-shell">
      <Sidebar
        activeKey={activeKey}
        onSelect={handleSelect}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />
      <main className="rb-main">
        <div className="rb-frame-area">
          {product ? <ProductFrame product={product} /> : <Presentation />}
        </div>
      </main>
    </div>
  )
}
