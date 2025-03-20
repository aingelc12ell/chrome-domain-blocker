const domainInput = document.getElementById("domain-input");
const addDomainButton = document.getElementById("add-domain");
const blocklistElement = document.getElementById("blocklist");

// Load the current blocklist and display it
chrome.storage.sync.get("blocklist", (data) => {
  const blocklist = data.blocklist || [];
  updateBlocklistUI(blocklist);
});

addDomainButton.addEventListener("click", () => {
  const domain = domainInput.value.trim();
  if (domain) {
    chrome.storage.sync.get("blocklist", (data) => {
      const blocklist = data.blocklist || [];
      if (!blocklist.includes(domain)) {
        blocklist.push(domain);
        chrome.runtime.sendMessage({ type: "updateBlocklist", blocklist }, (response) => {
          if (response.success) {
            updateBlocklistUI(blocklist);
          }
        });
      }
    });
  }
  domainInput.value = "";
});

function updateBlocklistUI(blocklist) {
  blocklistElement.innerHTML = "";
  blocklist.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      const updatedBlocklist = blocklist.filter((d) => d !== domain);
      chrome.runtime.sendMessage({ type: "updateBlocklist", blocklist: updatedBlocklist }, (response) => {
        if (response.success) {
          updateBlocklistUI(updatedBlocklist);
        }
      });
    });
    li.appendChild(removeButton);
    blocklistElement.appendChild(li);
  });
}