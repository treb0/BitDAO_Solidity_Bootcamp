$(document).ready(() => {
  // DOM components
  const inputBox = document.getElementById('input-text');
  const cidBox = document.getElementById('ipfs-request');
  // Confirmation message
  console.log('web3Bridge.js loaded');
  // Function calls
  $('#add-data').click(() => {
    addData(inputBox.value);
  });
  $('#get-data').click(() => {
    getData(cidBox.value);
  });
  $('#add-file').click(() => {
    addFile();
  });
  $('#get-image').click(() => {
    getImage(cidBox.value);
  });
});

async function addFile() {
  const reader = new FileReader();
  reader.onloadend = function () {
    const buf = buffer.Buffer.from(reader.result);
    const route = 'addFile';
    const req = { data: buf };
    function update(response) {
      $('#output-text').val(response.path);
    }
    ajaxCall(route, req, update);
  }
  const file = document.getElementById("file");
  reader.readAsArrayBuffer(file.files[0]);
}

async function addData(newData) {
  const route = 'addData';
  const req = { data: newData };
  function update(response) {
    $('#output-text').val(response.path);
  }
  ajaxCall(route, req, update);
}

async function getData(cid) {
  const route = 'getData';
  const req = { data: cid };
  function update(response) {
    $('#output-text').val(response[0]);
  }
  ajaxCall(route, req, update);
}

async function getImage(cid) {
  const route = 'getImage';
  const req = { data: cid };
  function update(response) {
    function toBase64(arr) {
      arr = new Uint8Array(arr)
      return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    }
    $('#ipfs-image').attr('src', `data:image/png;base64,${toBase64(response[0].data)}`);
  }
  ajaxCall(route, req, update);
}