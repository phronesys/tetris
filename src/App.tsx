import {useEffect, useState} from 'react'
import './App.css'

function TetrisTable() {
  const [count, setCount] = useState(0);
  const tetrisColors = ["red", "blue", "green", "yellow", "cyan", "magenta", "white"];
  const [table, setTable] = useState<string[][]>(
    Array(20).fill(Array(10).fill(""))
  );
  const LAST_COL = table.length - 1;
  /* example with square block */
  const [fallingBlock, setFallingBlock] = useState(["0,4", "0,5", "1,4", "1,5"])
  // const [fallingBlock, setFallingBlock] = useState(["0,4", "1,4", "2,4", "3,4"])
  const [insertedBlocks, setInsertedBlocks] = useState([
    "19,0",
    "19,1",
    "19,2",
    "19,3",
    "19,4",
    "19,5",
    "19,6",
    "19,7",
    "19,8",
    "19,9",
    "3,6"
  ])

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

  function updateRow(col: number, row: number, newValue: string) {
    // copy the table
    const updatedTable = [...table];
    // copy the column
    const updatedCol = [...updatedTable[col]];

    updatedCol[row] = newValue;
    updatedTable[col] = updatedCol;
    setTable(updatedTable);
  }


  /*
  * Paints block coordinates
  * */
  function paintTetrisCoordinates(colIndex: number, rowIndex: number) {
    const defaultClass = "tetris-table__row";
    const stringCoordinate = `${colIndex},${rowIndex}`;

    // paints falling block coordinate
    if (fallingBlock.includes(stringCoordinate)) {
      const color = "red";
      return `tetris-table__row row-active__${color}`;
    }

    // paints inserted block coordinates
    if (insertedBlocks.includes(stringCoordinate)) {
      const color = "white";
      return `tetris-table__row row-active__${color}`;
    }

    return defaultClass
  }

  /*
  * it finds coordinates of the fallingBlock's bottom
  * by finding the bigger column index
  *  */
  const getFallingBlockBottomCoordinates = (): string[] => {
    let biggerColumnIndex = 0;

    for (let i = 0; i < fallingBlock.length; i++) {
      const [col] = fallingBlock[i].split(",")
      const colIndex = Number(col);
      if (colIndex > biggerColumnIndex) biggerColumnIndex = colIndex;
    }

    return fallingBlock.filter(block => block.startsWith(`${biggerColumnIndex},`))
  }

  /*
  * check from the 4 coordinates of fallingBlock if one is touching
  * the end of the table, or it touches some inserted block
  * */
  const isFallingBlockBottomCollisioning = (): boolean => {
    return fallingBlock.some(coordinate => {
      // when goes to the end
      const bottomCollision = coordinate.startsWith(`${LAST_COL}`);
      if (bottomCollision) return bottomCollision;

      // check bottom collision with inserted blocks
      return insertedBlocks.some(block => {
        const fallingBlockBottomCoordinates = getFallingBlockBottomCoordinates();
        return fallingBlockBottomCoordinates.some(bottomCoordinate => {
          const [col, row] =  bottomCoordinate.split(",");
          const nextColIndex = Number(col) + 1;

          return block === `${nextColIndex},${row}`;
        });
      });

    })
  }

  useEffect(() => {
    console.log(table)
  }, [table])


  useEffect(() => {
    const interval = setInterval(() => {
      if (count !== LAST_COL) {
        setCount(count + 1)
      }
    }, 1000)

    return () => clearInterval(interval);
  });

  useEffect(() => {
    setFallingBlock(fb => {


      if (isFallingBlockBottomCollisioning()) {
        // block is inserted on collision
        setInsertedBlocks([...insertedBlocks, ...fallingBlock])
        setCount(0)
        return [];
      }

      // update falling block coordinate positions
      return fb.map(coordinate => {
        const [col, row] = coordinate.split(",");
        const colIndex = Number(col);

        return `${colIndex + 1},${row}`
      })
    })

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
                      className={paintTetrisCoordinates(colIndex, rowIndex)}
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
