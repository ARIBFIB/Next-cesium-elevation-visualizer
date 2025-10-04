'use client'
import { useRef } from 'react'

export function FileUploader({ onFileSelect, disabled }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".geojson,.shp"
        style={{ display: 'none' }}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          backgroundColor: disabled ? '#a0a0a0' : '#48b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {disabled ? 'Processing...' : 'Choose File'}
      </button>
    </div>
  )
}