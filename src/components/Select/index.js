import React, {useState, useEffect, useRef} from 'react'
import './Select.css'

export default function Index(props) {
  const [searchValue, setSearchValue] = useState('')
  const searchHandler = (e) => { setSearchValue(e.target.value) }
  const searchRef = useRef()

  const selectValues = props.values
  const [values, setValues] = useState([])
  const [activeOption, setActiveOption] = useState(0)
  const [isOptionsOpen, setOptionsOpenStatus] = useState(false)

  const onWrapperClick = (e) => {
    e.stopPropagation()
    searchRef.current.focus()
  }

  useEffect(() => {
    if (!isOptionsOpen) return

    const clickOutside = () => {
      setOptionsOpenStatus(false)
    }

    window.addEventListener('click', clickOutside)
    return () => {
      window.removeEventListener('click', clickOutside)
    }
  })

  const selectOptions = selectValues
    .filter(value => {
      const isSearched = !searchValue || value.toLowerCase().includes(searchValue.toLowerCase())
      return !values.includes(value) && isSearched
    })
    .map((value, i) => (
      <li
        className={`
          select-option
          ${(i === activeOption) ? 'select-option-active' : ''}
        `}
        key={value}
        onClick={() => {
          setSearchValue('')
          setValues([...values, value])
        }}
        onMouseOver={() => {setActiveOption(i)}}
      >
        {value}
      </li>
  ))

  const selectedValues = values.map(selectedValue => (
    <button
      className="selected-value"
      key={selectedValue}
      onClick={() => {
        setValues(values.filter((value) => value !== selectedValue))
      }}
    >
      {selectedValue}
    </button>
  ))

  const keyHandler = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (activeOption > 0)
          setActiveOption(activeOption - 1)
        else
          setActiveOption(selectOptions.length - 1)
        break

      case 'ArrowDown':
        if (activeOption < selectOptions.length - 1)
          setActiveOption(activeOption + 1)
        else
          setActiveOption(0)
        break

      case 'Escape':
        setOptionsOpenStatus(false)
        searchRef.current.blur()
        break

      case 'Tab':
        setOptionsOpenStatus(false)
        break
    }

  }

  return (
    <div
      className="select-input-wrapper"
      onClick={onWrapperClick}
      onKeyDown={keyHandler}
    >
      <input
        className="values-input"
        type="text"
        name="values"
        value={values}
        readOnly
      />
      {selectedValues}
      <input
        ref={searchRef}
        className="search-input"
        type="text"
        value={searchValue}
        onChange={searchHandler}
        onFocus={() => {setOptionsOpenStatus(true)}}
      />

      { isOptionsOpen &&
      (<ul className="select-options">
        {(selectOptions.length) ? selectOptions : 'Ничего не найдено'}
      </ul>)
      }
    </div>
  )
}
