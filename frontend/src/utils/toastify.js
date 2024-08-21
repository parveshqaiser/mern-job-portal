
import { ToastContainer , toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const AlertMessage = ()=>{
    return(
        <ToastContainer 
            position="top-right"
            autoClose={2400}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
        />
    )
}