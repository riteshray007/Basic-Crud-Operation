import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

function Home(){

      const [data , setdata] = useState();
      const [values , setvalues] = useState({
            name : '',
            mobileno:'',
            address:'',
            employeeid:''
      })
      const [addupdateflag , setaddupdateflag ] = useState(false);

      const getData = ()=>{
            axios.get('http://localhost:8080/')
            .then(res => {
                 console.log( "from frontend - " ,  res.data);
                 setdata(res.data);
            })
            .catch(err => console.log(err) );
      }

      useEffect(()=>{
            getData();
      },[] )

      const handleSubmit = (e) =>{
            e.preventDefault();
            console.log("values - " , values );
            axios.post('http://localhost:8080/addemployee' , values )
            .then(res =>   {
                  console.log(res)
                  getData();
                  setvalues({});
            }   )
            .catch(err => console.log(err));
      }

      const editEntry = (pkey) =>{
            setaddupdateflag(true);
            axios.get(`http://localhost:8080/edit/`+pkey )
            .then(res => {
                  res = res.data.rows[0];
                  setvalues(res);
                  console.log(values);
            })
            .catch( err => console.log(err) )
      }

      const deleteEntry = (pkey)=>{
            axios.delete('http://localhost:8080/delete/'+pkey )
            .then(res =>{
                  console.log(res);
                  getData();
            })
            .catch(err => console.log(err))
      }

      const updateEntry = () => {
            axios.put('http://localhost:8080/update' , values )
            .then(res=> console.log(res))
            .catch(err => console.log(err));

      }

      return (
            <div className="d-flex justify-content-center align-items-center" >
                  
                  <div className=" w-50 rounded p-3 " >
                        <form  >
                              <h2>Add Employee</h2>
                              <div className="mb-2">
                                    <label htmlFor="">Name</label>
                                    <input type="text" placeholder="Enter name"  className="form-control" value={values.name || ''} 
                                    onChange={ e => setvalues({...values , name : e.target.value }) }/>
                              </div>
                              <div className="mb-2" >
                                    <label htmlFor="" >Employee Id</label>
                                    <input type="text" placeholder="Employee Id" className="form-control" value={values.employeeid || ''}
                                    onChange={ e => setvalues({...values , employeeid : e.target.value }) } />
                              </div>
                              <div className="mb-2" >
                                    <label htmlFor="" >Mobile No</label>
                                    <input type="number" placeholder="Mobile No." className="form-control"  value={values.mobileno || ''}
                                    onChange={ e => setvalues({...values , mobileno : e.target.value }) }  />
                              </div>
                              <div className="mb-2" >
                                    <label htmlFor="" >Address</label>
                                    <input type="text" placeholder="Address"  className="form-control"  value={values.address || ''}
                                    onChange={ e => setvalues({...values , address : e.target.value }) }/>
                              </div>
                              {
                                    addupdateflag === false ? 
                                    <button className="btn btn-success" onClick={handleSubmit} > Submit </button> :
                                    <button className="btn btn-success" onClick={updateEntry} > update </button>
                              }
                        </form>
                  </div>
                  
                  <div className="rounded p-3" >

                        <table className="table" >
                              <thead>
                                    <tr>
                                          <th>Name</th>
                                          <th>Mobile No.</th>
                                          <th>Employee Id</th>
                                          <th>Address</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {data?.map((employee , index)=>{
                                          return <tr key={index} >
                                                <td>{employee.name}</td>
                                                <td>{employee.mobileno}</td>
                                                <td>{employee.employeeid}</td>
                                                <td>{employee.address}</td>
                                                <td><button onClick={ () => editEntry(employee.mobileno)} >Edit</button></td>
                                                <td><button onClick={() => deleteEntry(employee.mobileno) } >Delete</button></td>
                                          </tr>
                                    })}
                              </tbody>
                        </table>
                  </div>
            
            </div>
      )
}

export default Home;