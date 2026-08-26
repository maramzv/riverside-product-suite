import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ProductFrame from './components/ProductFrame'
import Presentation from './components/Presentation'
import { products } from './config/products'

export default function App() {
  const [activeKey, setActiveKey] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const product = products[activeKey]

  return (
    <div className="rb-shell">
      <Sidebar
        activeKey={activeKey}
        onSelect={setActiveKey}
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
