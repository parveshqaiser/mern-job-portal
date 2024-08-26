import { render ,screen} from "@testing-library/react"
import TestingComponent from "../components/TestingComponent"
import "@testing-library/jest-dom"

// we can have nested describe also

// we can write it in place of test

// "it" is just an alias of test

describe("test cases for TestingComponent", ()=>{
    test('should testing component loading properly ', () => {
    
        render(<TestingComponent />) 
        // will load this component in js dom
    
         // screen in an object
        let head = screen.getByRole("button");
        // getByRole means , it can be heading , button etc etc
        // getByText means , if there is something on the screen by the text then it will get it
    
        expect(head).toBeInTheDocument();
    });
    
    test("should load placeholder text in input element", ()=>{
    
        render(<TestingComponent />);
    
        // below line is called querying
        let text = screen.getByPlaceholderText("enter name");
    
        expect(text).toBeInTheDocument();
    })
    
    
    test("should load all input boxes", ()=>{
        render(<TestingComponent />);
        let text = screen.getAllByRole("textbox");  // will check for multiple text boxes
        // return an react element which is nothing but an object
    
        expect(text.length).not.toBe(3);
    })
})


