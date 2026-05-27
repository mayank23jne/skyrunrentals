const fs = require('fs');
const files = [
  'd:/holidayhavenhomes/backend/views/admin/properties/add.ejs',
  'd:/holidayhavenhomes/backend/views/admin/properties/edit.ejs'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');

  // 1. Change country options
  content = content.replace(/<option value="<%= c.id %>" data-name="<%= c.name %>">/g, '<option value="<%= c.name %>" data-id="<%= c.id %>">');
  content = content.replace(/<option value="<%= c\.name %>" data-name="<%= c\.name %>">/g, '<option value="<%= c.name %>" data-id="<%= c.id %>">'); // in case they were different

  // 2. Fix JS country/state select
  content = content.replace(/const countryId = document\.getElementById\('country-select'\)\.value;/g,
    "const select = document.getElementById('country-select');\n                const countryId = select.options[select.selectedIndex].dataset.id;");

  content = content.replace(/const stateId = document\.getElementById\('state-select'\)\.value;/g,
    "const select = document.getElementById('state-select');\n                const stateId = select.options[select.selectedIndex].dataset.id;");

  // 3. Fix the state/city option generation in JS
  content = content.replace(/option\.value = s\.id;\s*option\.dataset\.name = s\.name;/g,
    "option.value = s.name;\n                        option.dataset.id = s.id;");

  content = content.replace(/option\.value = c\.id;\s*option\.dataset\.name = c\.name;/g,
    "option.value = c.name;\n                        option.dataset.id = c.id;");

  // Also fix contact section if there is one (contactCountryName, etc.)
  content = content.replace(/const contactCountryId = document\.getElementById\('contactCountry'\)\.value;/g,
    "const select = document.getElementById('contactCountry');\n                const contactCountryId = select.options[select.selectedIndex].dataset.id;");

  content = content.replace(/const contactStateId = document\.getElementById\('contactState'\)\.value;/g,
    "const select = document.getElementById('contactState');\n                const contactStateId = select.options[select.selectedIndex].dataset.id;");

  fs.writeFileSync(f, content, 'utf-8');
  console.log(`Updated ${f}`);
});
