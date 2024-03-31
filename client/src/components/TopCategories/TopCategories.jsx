import React from 'react'
import { ProductCard } from '../ProductCard/ProductCard'

export const TopCategories = ({topCategories}) => {

  return (
    <div className='d-flex flex-wrap gap-3 justify-content-center  m-0 mb-5'>

      {topCategories?.map((elem, i) => (
            <div key={i} className='d-flex flex-wrap gap-3 justify-content-center' >
              <ProductCard elem={elem} />
            </div>
          ))}
    </div>
  )
}
