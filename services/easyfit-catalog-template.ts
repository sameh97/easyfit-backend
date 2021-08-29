export const catalogTemplate = `<style>
html { font-size: 22px; }
body { padding: 1rem; }

.flex-container {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 0 0 100%;
  flex-direction: column;
}

.flex-container>div {
  
  font-size: 15px;
  padding: 1px 0;
}

.center {
  text-align: center;
}

.header {
  background-color: #3949AB;
  text-align: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 30px;
  color: white;
}


.card-container {
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: black;
  padding: 1rem;
  margin: 10px;
}


.card {
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: black;
  padding: 1rem;
}

.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.item-flex-container {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 0 0 100%;
  flex-direction: row;
}

.item-flex-container>div {
  text-align: center;
  font-size: 12px;
  padding: 5px 0;
}


      </style>
      <body>
      <div class="header">EasyFit</div>
      <div class="flex-container">

      <div> 
      <div class="card-container">
      <div id="easyfit-catalog-container" class="cards">
       
      </div>
      </div>
      </div>
      </div>

    </body>`;
