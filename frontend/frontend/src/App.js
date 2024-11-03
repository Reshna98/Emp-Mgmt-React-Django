import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminReg from "./AdminReg";
import Adminlogin from "./Adminlogin";
import Admindash from "./Admindash";
import Add_employee from "./Add_employee";
import Employee_List from "./Employee_List";
import Update_employee from "./Update_employee";
import Admin_profile from "./Admin_profile";
import ChangePassword from "./PasswordChange";
function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Adminlogin />}></Route>
            <Route path="register/" element={<AdminReg />}></Route>
            <Route path="home/" element={<Admindash />}></Route>
            <Route path="add_emp/" element={<Add_employee />}></Route>
            <Route path="emp_list/" element={<Employee_List />}></Route>
            <Route path="/update_employee/:id" element={<Update_employee />}></Route>
            <Route path="/profile" element={<Admin_profile />}></Route>
            <Route path="/password" element={<ChangePassword />}></Route>


  
  
          </Routes>
        </BrowserRouter>
      </>
    );
  }
  

export default App;
