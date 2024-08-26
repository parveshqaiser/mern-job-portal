import { fireEvent, render , screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import NavBar from "../components/NavBar"
import reduxStore from "../shared/reduxStore"
import "@testing-library/jest-dom";


test('should load login button', () => {
  
    render(<Provider store={reduxStore}>
        <BrowserRouter>
            <NavBar />
        </BrowserRouter>
    </Provider>)

    let button = screen.getByRole("button", {name : "Login"});

    expect(button).toBeInTheDocument();
})

// to check if button fires or not

// test('just an example ', () => {
  
//     render(<Provider store={reduxStore}>
//         <BrowserRouter>
//             <NavBar />
//         </BrowserRouter>
//     </Provider>)

//     let button = screen.getByRole("button", {name : "Login"});

//     fireEvent.click(button)

//     expect(button).toBeInTheDocument();
// })
