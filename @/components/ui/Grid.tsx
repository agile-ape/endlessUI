import React, { useState } from 'react'

const Grid = () => {
  // Initialize grid data
  const [gridData, setGridData] = useState(Array(30).fill(Array(20).fill(20)))

  // Initialize average
  const [average, setAverage] = useState(0)

  // Function to handle number submission
  const handleNumberSubmit = (row, col, number) => {
    const newGridData = [...gridData]
    newGridData[row][col] = number
    setGridData(newGridData)

    // Recalculate average
    const total = newGridData.flat().reduce((acc, curr) => acc + curr, 0)
    const newAverage = total / (100 * 100)
    setAverage(newAverage)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100px', margin: 'auto' }}>
        {gridData.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((col, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '10px',
                  height: '10px',
                  // backgroundColor: `rgba(0, ${255 - Math.abs(col - gridData[rowIndex][colIndex])}, 0, ${col / 9999})`,
                  backgroundColor: `green`,
                  border: '1px solid black',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Grid
