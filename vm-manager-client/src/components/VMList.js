import React from "react";
import "../styles/VMList.css";

const VMList = ({ vms, onConnectVM, onDeleteVM }) => {
  return (
    <div className="vm-list">
      <h2>VMs</h2>
      <div className="vm-cards">
        {vms.length === 0 ? (
          <p className="no-vms-watermark">No VMs data available.</p>
        ) : (
          vms.map((vm) => (
            <div key={vm.name} className="vm-card">
              <h3>{vm.name}</h3>
              <p>IP Addres: {vm.ip}</p>
              <p>Domain: {vm.domain}</p>
              <p>Username: {vm.username}</p>
              <button
                className="connect-button"
                onClick={() => onConnectVM(vm)}
              >
                Connect
              </button>
              <button
                className="delete-button"
                onClick={() => onDeleteVM(vm.name)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VMList;
