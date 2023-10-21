import {useCallback, useEffect, useState} from 'react'
import {useKey} from "react-use";
import './App.css'

function TetrisTable() {
  const [count, setCount] = useState(0);
  const tetrisColors = ["red", "blue", "green", "yellow", "cyan", "magenta", "white"];
  const [table, setTable] = useState<string[][]>(
    Array(20).fill(Array(10).fill(""))
  );
  const LIMIT_BOTTOM = 19;
  const LIMIT_RIGHT = 9;
  const LIMIT_LEFT = 0;
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
  const [rowDirection, setRowDirection] = useState(0);

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

    return fallingBlock.filter(coordinate => coordinate.startsWith(`${biggerColumnIndex},`))
  }

  /*
  * it finds left and right coordinates of the fallingBlock
  * */
  const getFallingBlockLateralCoordinates = (fallingBlock: string[]): string[] => {
    let minRowIndex = 19, maxRowIndex = 0;

    for (let i = 0; i < fallingBlock.length; i++) {
      const [_col, row] = fallingBlock[i].split(",");
      const rowIndex = Number(row);
      if (rowIndex > maxRowIndex) maxRowIndex = rowIndex;
      if (rowIndex > minRowIndex) minRowIndex = rowIndex;
    }

    const leftCoordinates = fallingBlock.filter(coordinate => coordinate.endsWith(`,${minRowIndex}`));
    const rightCoordinates = fallingBlock.filter(coordinate => coordinate.endsWith(`,${maxRowIndex}`));

    return [...leftCoordinates, ...rightCoordinates];
  }

  /*
  * check from the 4 coordinates of fallingBlock if one is touching
  * the end of the table, or it touches some inserted block
  * */
  const fallingBlockBottomCollision = (): boolean => {
    return fallingBlock.some(coordinate => {
      // when goes to the end
      const tableLimit = coordinate.startsWith(`${LIMIT_BOTTOM}`);
      if (tableLimit) return tableLimit;
      // console.log(coordinate)

      const fallingBlockBottomCoordinates = getFallingBlockBottomCoordinates();

      // check bottom collision with inserted blocks
      return insertedBlocks.some(insertedBlock => {
        return fallingBlockBottomCoordinates.some(bottomCoordinate => {
          const [col, row] = bottomCoordinate.split(",");
          const nextColIndex = Number(col) + 1;

          return insertedBlock === `${nextColIndex},${row}`;
        });
      });

    })
  }

  const fallingBlockLateralCollision = (fallingBlock: string[], direction: 'left' | 'right'): boolean => {
    return fallingBlock.some(coordinate => {
      // check table limit collision
      const limitLeft = direction === 'left' && coordinate.endsWith(`,${LIMIT_LEFT}`);
      const limitRight = direction === 'right' && coordinate.endsWith(`,${LIMIT_RIGHT}`);
      console.log(coordinate, limitLeft, limitRight)
      const tableLimit = limitRight || limitLeft;
      if (tableLimit) return tableLimit;

      // get left and right coordinates of the block
      const fallingBlockLateralCoordinates = getFallingBlockLateralCoordinates(fallingBlock);
      // check if any insertedBlock has lateral collision with fallingBlock
      return insertedBlocks.some(insertedBlock => {
        return fallingBlockLateralCoordinates.some(lateralCoordinate => {
          const [col, row] = lateralCoordinate.split(",");
          const directionMovement = direction === 'left' ? -1 : 1;
          const nextRowIndex = Number(row) + directionMovement;

          return insertedBlock === `${col},${nextRowIndex}`;
        })
      })
    })
  };



  function moveTowards(direction: 'left' | 'right') {
    console.log(direction)


  }

  /*
  * Rotation disabled, we need an algorithm to rotate by the center,
  * but not all pieces have a center coordinate
  * */
  // function rotateTowards(direction: 'clockwise' | 'counterclockwise'){
  //   // clockwise:         (x,y) becomes (y,−x)
  //   // counterclockwise:  (x,y) becomes (−y,x)
  //   if (direction === 'clockwise') {
  //     setFallingBlock(fb => fb.map(block => {
  //       const [col, row] = block.split(",");
  //       const colIndex = Number(col) * -1;
  //       const rowIndex = Number(row);
  //
  //       return `${rowIndex},${colIndex}`
  //     }));
  //   } else {
  //     setFallingBlock(fb => fb.map(block => {
  //       const [col, row] = block.split(",");
  //       const colIndex = Number(col);
  //       const rowIndex = Number(row) * -1;
  //
  //       return `${rowIndex},${colIndex}`
  //     }));
  //   }
  // }

  useEffect(() => {
    console.log(table)
  }, [table])


  useEffect(() => {
    const interval = setInterval(() => {
      if (count !== LIMIT_BOTTOM) {
        setCount(count + 1)
      }
    }, 1000)

    return () => clearInterval(interval);
  });

  const handleUserInput = useCallback((event: KeyboardEvent) => {
    const {key} = event;
    console.log("handleUser Input", key)

    if (key === 'a' || key === 'ArrowLeft') {
      setFallingBlock(fb => {
        if (fallingBlockLateralCollision(fb, 'left')) return fb;

        return fb.map(block => {
          const [col, row] = block.split(",");
          const colIndex = Number(col);
          const rowIndex = Number(row);

          return `${colIndex},${rowIndex - 1}`;
        })
      })
    }
    else if (key === 'd' || key === 'ArrowRight') {
      setFallingBlock(fb => {
        if (fallingBlockLateralCollision(fb, 'right')) return fb;

        return fb.map(block => {
          const [col, row] = block.split(",");
          const colIndex = Number(col);
          const rowIndex = Number(row);

          return `${colIndex},${rowIndex + 1}`;
        })
      })
    }
      // else if (key === 'w' || key === 'ArrowUp') rotateTowards('clockwise');
    // else if (key === 's' || key === 'ArrowDown') rotateTowards('counterclockwise');
    else if (key === '') () => {
      // handle space input
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleUserInput);
    () => window.removeEventListener('keydown', handleUserInput)
  }, [handleUserInput]);

  useEffect(() => {
    setFallingBlock(fb => {


      if (fallingBlockBottomCollision()) {
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
