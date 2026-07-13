import { useEffect, useMemo, useState } from 'react'
import './App.css'

const BRANCH_URLS = ['api/branch1.json', 'api/branch2.json', 'api/branch3.json']

const formatNumber = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

function getProductRevenue(product) {
  return product.unitPrice * product.sold
}

function mergeBranchProducts(branches) {
  const revenueByName = new Map()

  branches.forEach((branch) => {
    branch.products.forEach((product) => {
      const name = product.name.trim()
      const productKey = name.toLowerCase()
      const revenue = getProductRevenue(product)
      const existingProduct = revenueByName.get(productKey)

      revenueByName.set(productKey, {
        name: existingProduct?.name ?? name,
        revenue: (existingProduct?.revenue ?? 0) + revenue,
      })
    })
  })

  return Array.from(revenueByName.values()).sort(
    (firstProduct, secondProduct) =>
      firstProduct.name.localeCompare(secondProduct.name, undefined, {
        sensitivity: 'base',
      }),
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadBranches() {
      try {
        const responses = await Promise.all(BRANCH_URLS.map((url) => fetch(url)))
        const failedResponse = responses.find((response) => !response.ok)

        if (failedResponse) {
          throw new Error(`Could not load ${failedResponse.url}`)
        }

        const branches = await Promise.all(
          responses.map((response) => response.json()),
        )

        if (isActive) {
          setProducts(mergeBranchProducts(branches))
          setError('')
        }
      } catch {
        if (isActive) {
          setError('Unable to load branch revenue data.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadBranches()

    return () => {
      isActive = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return products
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch),
    )
  }, [products, searchTerm])

  const displayedTotalRevenue = useMemo(
    () =>
      filteredProducts.reduce((total, product) => total + product.revenue, 0),
    [filteredProducts],
  )

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand-mark" href="/" aria-label="Wowcher revenue home">
            wowcher
          </a>
          <span className="header-label">Revenue dashboard</span>
        </div>
        <nav className="category-nav" aria-label="Wowcher sections">
          <span>Local</span>
          <span>Restaurants</span>
          <span>Shopping</span>
          <span>Holiday Deals</span>
          <span>Guides</span>
          <span>Near Me</span>
        </nav>
      </header>

      <main className="app-shell">
        <section className="page-header" aria-labelledby="page-title">
          <div className="header-row">
            <div>
              <p className="eyebrow">Branch sales report</p>
              <h1 id="page-title">Product Revenue</h1>
              <p className="intro">
                Merged sales from all three branches, sorted by product name.
              </p>
            </div>
            <div className="summary-panel" aria-label="Displayed total revenue">
              <span>Total revenue</span>
              <strong>{formatNumber(displayedTotalRevenue)}</strong>
            </div>
          </div>
        </section>

        <section className="table-section" aria-labelledby="table-title">
          <div className="toolbar">
            <h2 id="table-title">Products</h2>
            <label className="search-control" htmlFor="product-search">
              <span>Search</span>
              <input
                id="product-search"
                name="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Filter by product name"
              />
            </label>
          </div>

          {isLoading && <p className="state-message">Loading branch data...</p>}

          {!isLoading && error && (
            <p className="state-message error" role="alert">
              {error}
            </p>
          )}

          {!isLoading && !error && (
            <div className="table-wrap">
              <table>
                <caption>
                  Product revenue across branch1, branch2 and branch3
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Product name</th>
                    <th scope="col" className="number-column">
                      Total revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.name}>
                      <td>{product.name}</td>
                      <td className="number-column">
                        {formatNumber(product.revenue)}
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="2" className="empty-message">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">Total</th>
                    <td className="number-column">
                      {formatNumber(displayedTotalRevenue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default App
