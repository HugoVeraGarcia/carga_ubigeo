
import React, { useState } from "react";
import "./ReadFileBidon.css";
import * as XLSX from "xlsx";
import axios from "axios";
//import { useEffect } from "react";

export default function ReadFileBidon() {
  const [items, setItems] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);

    const readExcel = (file) => {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
    
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
    
          const wb = XLSX.read(bufferArray, { type: "buffer" });
    
          const wsname = wb.SheetNames[0];
    
          const ws = wb.Sheets[wsname];
    
          const data = XLSX.utils.sheet_to_json(ws);
    
          resolve(data);
        };
    
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    
      promise.then((d) => {
        setItems(d);
        setDataUbigeo(d)
        //d.forEach((element) => setDataUbigeo(dataUbigeo.push(element)));
        d.forEach((element) => {
          const data ={
            country:element.country,
            ubigeo: element.ubigeo.toString() ,
            region:element.departamento,
            province:element.provincia,
            district:element.distrito,
            latitude:element.latitud,
            longuitude:element.longitud
          }
          //console.log("data::::", data)
          // console.log("element::::", element)
          axios
          .post("http://localhost:4000/api/v1/ubigeo/", data)
          .then((res) => console.log("desde post:::",res.data.data.ubigeo))
          .catch((error) => {
            console.log(error);
          });
          



        });

      });
    };

    
    
    return (
        <div>
        <input className="input"
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        />
  
        <table className="table container">
          <thead>
            <tr>
              <th scope="col">country</th>
              <th scope="col">ubigeo</th>
              <th scope="col">departamento</th>
              <th scope="col">provincia</th>
              <th scope="col">distrito</th>
              <th scope="col">latitud</th>
              <th scope="col">longitud</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.ubigeo}>
                <th>{d.country}</th>
                <th>{d.ubigeo}</th>
                <td>{d.departamento}</td>
                <td>{d.provincia}</td>
                <td>{d.distrito}</td>
                <td>{d.latitud}</td>
                <td>{d.longitud}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
  )
}
