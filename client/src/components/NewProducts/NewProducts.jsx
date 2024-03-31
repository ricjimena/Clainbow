import React from 'react'
import { ProductCard } from '../ProductCard/ProductCard'

export const NewProducts = ({newProducts, setNewProducts}) => {
  return (
    <div className='d-flex flex-wrap gap-3 justify-content-center  m-0 mb-5'>

      {newProducts?.map((elem, i) => (
            <div key={i} className='d-flex flex-wrap gap-3 justify-content-center' >
              <ProductCard elem={elem} />
            </div>
          ))}
    </div>
  )
}
