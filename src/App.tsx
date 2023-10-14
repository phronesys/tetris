import {useEffect, useState} from 'react'
import './App.css'

function TetrisTable() {
  const [count, setCount] = useState(0);
  const tetrisColors = ["red", "blue", "green", "yellow", "cyan", "magenta", "white"];
  const [table, setTable] = useState<[string[]]>(
    Array(20).fill(Array(10).fill(""))
  );
  const BOTTOM_LIMIT = table.length - 1;
  /* example with square block */
  const [fallingBlock, setFallingBlock] = useState(["0,4", "0,5", "1,4", "1,5"])
  // const [fallingBlock, setFallingBlock] = useState(["0,4", "1,4", "2,4", "3,4"])

  /*
  * piece: position + shape
  *
  * square (0, 4) (0, 5)
  *        (1, 4) (1, 5)
  * */

  function getRandomColor() {
    const colorIndex = Math.floor(Math.random() * tetrisColors.length)
    return tetrisColors[colorIndex]
  }

  function updateRow(col, row, newValue: string) {
    // copy the table
    const updatedTable = [...table];
    // copy the column
    const updatedCol = [...updatedTable[col]];

    updatedCol[row] = newValue;
    updatedTable[col] = updatedCol;
    setTable(updatedTable);
  }


  /*
  * revisa el fallingBlock y lo pinta
  * */
  function rowClassName(colIndex, rowIndex) {
    const defaultClass = "tetris-table__row";
    const stringCoordinate = `${colIndex},${rowIndex}`;

    // revisar si la coordenada corresponde a una coordenada del falling block
    const shouldPaint = fallingBlock.includes(stringCoordinate);

    // si no corresponde retorna el color default
    if (!shouldPaint) return defaultClass

    const color = "red";
    return `tetris-table__row row-active__${color}`;
  }

  function someCoordinateTouchesBottom(coordinates: string[]) {
    return coordinates.some(coordinate => {
      return coordinate.startsWith(`${BOTTOM_LIMIT}`)
    })
  }

  useEffect(() => {
    console.log(table)
  }, [table])


  useEffect(() => {
    const interval = setInterval(() => {
      if (count !== BOTTOM_LIMIT) {
        setCount(count + 1)
      }
    }, 1000)

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (!someCoordinateTouchesBottom(fallingBlock)) {
      const currentFallingBlock = fallingBlock.map(coordinate => {
        const [col, row] = coordinate.split(",");
        const colIndex = Number(col);

        if (count === 0) return `${colIndex},${row}`;
        return `${colIndex + 1},${row}`
      })
      setFallingBlock(currentFallingBlock)
    }

  }, [count]);

  return (
    <>
      <div>
        {count}
      </div>
      <div className="tetris-table">
        {
          table.map((col, colIndex) => {
            return (
              <div className="tetris-table__col" key={colIndex}>
                {col.map((row, rowIndex) => {
                  return (
                    <div
                      className={rowClassName(colIndex, rowIndex)}
                      key={rowIndex}
                    >
                      {`${colIndex},${rowIndex}`}
                    </div>
                  )
                })}
              </div>
            )
          })
        }
      </div>
    </>

  )
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 1000)
  });
  return <div>{count}</div>
}

function App() {

  return (
    <>
      <TetrisTable></TetrisTable>
    </>
  )
}

export default App
