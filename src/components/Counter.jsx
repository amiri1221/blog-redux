import { useSelector , useDispatch } from "react-redux";
import { increment , decrement , reset , incrementByamount } from "../reducers/CounterSlice";
import { useState } from "react";
import { SelectAllposts } from "../reducers/PostSlice";
const Counter = () => {

    const count = useSelector(SelectAllposts)
    const dispatch = useDispatch()

    const [incrementAmount , setIncrementAmount] = useState(0)

    const addValue = Number(incrementAmount) || 0

    const resetAll = () =>{
        setIncrementAmount(0)
        dispatch(reset())
    }
    const incrementChange =(e)=>{
        setIncrementAmount(e.target.value)
    }
    return (
        <div> 
            <p>{count}</p>
            <input name="increment" value={incrementAmount} onChange={incrementChange} />
            <button onClick={()=>dispatch(increment())}>+</button>
            <button onClick={()=>dispatch(decrement())}>-</button>
            
            <div>
                <button onClick={()=> dispatch(incrementByamount(addValue))}>Addamount</button>
                <button onClick={resetAll}>reset</button>
            </div>

        </div>
    );
}

export default Counter;