#!/bin/bash
#

initLocation=$PWD

cd $STORYBOOK_SCREENSHOT_PATH

index="./index.html"

if [ -e $index ]
        then rm $index
fi

##Create HTML page
cat >> $index <<HEAD
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>

    img {
        paddingBottom: 20px;
        borderBottom: 1 px solid #ccc;
    }

    h1, h2 {
        font-family: sans-serif;
        font-weight: normal;
    }

    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }

    /* Style the buttons that are used to open the tab content */
    .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
    }

    /* Change background color of buttons on hover */
    .tab button:hover {
        background-color: #ddd;
    }

    /* Create an active/current tablink class */
    .tab button.active {
        background-color: #ccc;
    }

    /* Style the tab content */
    .tabcontent {
        display: none;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-top: none;
    }

    .tabcontent.active {
      display: block;
    }

    .hide {
        display: none;
    }
  </style>
</head>
<body>
<div class="tab">
  <button class="tablinks active" onclick="openTab(event, 'difference')">Difference</button>
  <button class="tablinks" onclick="openTab(event, 'current')">Current</button>
  <button class="tablinks" onclick="openTab(event, 'reference')">Reference</button>
  <div style="padding-top: 12px;"><label>Filter <input id="filter" /></label></div>
</div>
HEAD

cat >> $index <<DIFF
<div id="difference" class="tabcontent active">
<h1>Difference</h1>
DIFF

for i in ./difference/*.png
do

if [[ $i == "./difference/*.png" ]]; then
continue
fi

caption=$(basename $i)
cat >> $index <<HTML
    <div class="image $i">
        <h2>$caption</h2>
        <img src="$i"/>
    </div>
HTML
done

cat >> $index <<DIFF
</div>
DIFF

cat >> $index <<DIFF
<div id="current" class="tabcontent">
<h1>Current</h1>
DIFF

for i in ./current/*.png
do
caption=$(basename $i)
cat >> $index <<HTML
   <div class="image $i">
        <h2>$caption</h2>
        <img src="$i"/>
   </div>
HTML
done

cat >> $index <<DIFF
</div>
DIFF


cat >> $index <<DIFF
<div id="reference" class="tabcontent">
<h1>Reference</h1>
DIFF

for i in ./reference/*.png
do
caption=$(basename $i)
cat >> $index <<HTML
     <div class="image $i">
        <h2>$caption</h2>
        <img src="$i"/>
    </div>
HTML
done

cat >> $index <<DIFF
</div>
DIFF

cat >> $index <<FOOT


<script>
    function openTab(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].className = tabcontent[i].className.replace("active", "");
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).className += " active";
      evt.currentTarget.className += " active";
    }

    document.getElementById('filter').addEventListener('input', (e) => filterSelection(e.target.value));

    function filterSelection(pattern) {
      [...document.getElementsByClassName("image")].forEach(e => {
        e.classList.remove('hide');
        if (e.className.indexOf(pattern) === -1) {
        e.classList.add('hide');
        }
      });
    }

</script>
</body>
</html>
FOOT

echo "You can see results with 'npx rnsst results'"

cd $initLocation
