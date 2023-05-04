import React, { useState, useEffect } from 'react';
import '../App.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const getData=()=>{
    fetch('products.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson.products);
        setProducts(myJson.products);
        setFilteredProducts(myJson.products);
      });
  }

  useEffect(() => {
    // Fetch data from JSON file or external API
    getData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProducts(filtered);
  }, [searchText, minPrice, maxPrice, products]);

  useEffect(() => {
    if (sortOption === 'name') {
      setFilteredProducts((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (sortOption === 'price') {
      setFilteredProducts((prev) => [...prev].sort((a, b) => a.price - b.price));
    }
  }, [sortOption]);

const displayProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
  
    return (
      <table className='products' style={{border:'2px solid forestgreen', margin: '0 auto', textAlign: 'center', borderCollapse: 'collapse', width: '40%', marginTop:'10px',  marginBottom:'10px'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.slice(start, end).map((product) => (
            <tr key={product.id}>
              <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
      {displayProducts()}
      <div>
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === pageCount}>
        Next
      </button>
    </div>
  </div>
);
};

export default ProductList;
