import React, { useContext, useEffect, useState } from 'react'
import './adminUsers.scss'
import { Button, Table } from 'react-bootstrap'
import { ClainbowContext } from '../../Context/ClainbowProvider';
import axios from 'axios';

export const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [reset, setReset] = useState(false);
  // me traigo el token del context
  const {token} = useContext(ClainbowContext);

  useEffect(()=>{
    if(token){
      // configuramos la cabecera de la petición HTTP. Queremos que vaya un objeto y un string, un objeto con una propiedad llamada Authorisation 
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`


      axios
        .get(`http://localhost:3000/users/allUsers`)
        .then((res)=>{       
          setUsers(res.data)
        })
        .catch((err)=>{
          console.log(err)
        })  
    }
  },[reset, token]);

  const onDisable = (id, status) => {
    let url = 'http://localhost:3000/users/activate'

    if (!status) {
     url = 'http://localhost:3000/users/deactivate'
    }
        
    axios
      .put(url, {id})
      .then(()=> setReset(!reset))
      .catch((err) => console.log(err))
  }

  return (
    <div className='adminUsers-right'>
      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Name</th>
            <th className="d-none d-md-table-cell">E-mail</th>
            <th className="d-none d-lg-table-cell">Phone Number</th>
            <th className="d-none d-xxl-table-cell">Passport/ID</th>
            <th className="d-none d-xxl-table-cell">Address</th>
            <th className="d-none d-xxl-table-cell">City</th>
            <th className="d-none d-xxl-table-cell">Country</th>
            <th>Status</th>
            <th>Action</th>

          </tr>
        </thead>
        <tbody>
          {users?.map((elem)=> (
            <tr key={elem.user_id}>
              <td>{elem.user_id}</td>
              <td>
              <img width={"30px"} src={elem.user_img ? `http://localhost:3000/images/users/${elem.user_img}`:"/assets/icons/default_user.png"} alt="UserProfilepic" />
              </td>
              <td>{elem.name} {elem.last_name}</td>
              <td className="d-none d-md-table-cell">{elem.email}</td>
              <td className="d-none d-lg-table-cell">{elem.phone_number}</td>
              <td className="d-none d-xxl-table-cell">{elem.passport}</td>
              <td className="d-none d-xxl-table-cell">{elem.address}</td>
              <td className="d-none d-xxl-table-cell">{elem.city}</td>
              <td className="d-none d-xxl-table-cell">{elem.country}</td>
              <td>{elem.user_isdisabled ? "Inactive" : "Active"}</td>
              <td>
                <Button 
                style={{
                  backgroundColor: '#B88D19',
                  color: 'white',
                  borderRadius: '20px',
                  width: '100px',
                  transition: 'transform 0.3s',
                  border: 'none'
                }}
                 onMouseEnter={(e) => e.target.style.transform = 'scale(0.95)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
                 onClick={()=>onDisable(elem.user_id, elem.user_isdisabled)}>{elem.user_isdisabled ? "Enable" : "Disable"}</Button>
              </td>
            </tr>
          ))}         
      
        </tbody>
      </Table>
    </div>
  )
}
