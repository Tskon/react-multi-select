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
  const [isReadyToDelete, setReadyToDeleteStatus] = useState(false)

  const onWrapperClick = () => {
    setOptionsOpenStatus(true)
    searchRef.current.focus()
  }

  useEffect(() => {
    if (searchValue) setOptionsOpenStatus(true)
  }, [searchValue])

  useEffect(() => {
    setReadyToDeleteStatus(false)
  }, [searchValue, values])

  const wrapperRef = useRef()
  useEffect(() => {
    if (!isOptionsOpen) return setActiveOption(0)

    const clickOutside = (e) => {
      if (!wrapperRef.current || wrapperRef.current.contains(e.target)) {
        return
      }
      setOptionsOpenStatus(false)
      setReadyToDeleteStatus(false)
    }

    window.addEventListener('click', clickOutside)
    return () => {
      window.removeEventListener('click', clickOutside)
    }
  })

  const valuesForOptions = selectValues.filter(value => {
    const isSearched = !searchValue || value.toLowerCase().includes(searchValue.toLowerCase())
    return !values.includes(value) && isSearched
  })

  const selectOptions = valuesForOptions.map((value, i) => (
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

  const selectedValues = values.map((selectedValue, i) => (
    <button
      className={`
        selected-value
        ${(isReadyToDelete && i === values.length - 1) ? 'ready-to-delete' : ''}
      `}
      key={selectedValue}
      onClick={() => {
        setValues(values.filter((value) => value !== selectedValue))
      }}
    >
      {selectedValue}
    </button>
  ))

  const keyHandler = (e) => {
    console.log(e.key)
    switch (e.key) {
      case 'ArrowUp':
        if (!isOptionsOpen) {
          setOptionsOpenStatus(true)
          break
        }
        if (activeOption > 0)
          setActiveOption(activeOption - 1)
        else
          setActiveOption(selectOptions.length - 1)
        break

      case 'ArrowDown':
        if (!isOptionsOpen) {
          setOptionsOpenStatus(true)
          break
        }
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

      case 'Enter':
        if (!isOptionsOpen) break
        setValues([...values, valuesForOptions[activeOption]])
        setOptionsOpenStatus(false)
        break

      case 'Backspace':
        if (searchValue) break
        if (isReadyToDelete) {
          setValues([...values.slice(0, -1)])
        } else {
          setReadyToDeleteStatus(true)
          setOptionsOpenStatus(false)
        }
        break
    }
  }

  return (
    <div
      ref={wrapperRef}
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
      (<ul className="select-options" style={{
        top: wrapperRef.current.clientHeight
      }}>
        {(selectOptions.length) ? selectOptions : 'Ничего не найдено'}
      </ul>)
      }
    </div>
  )
}
