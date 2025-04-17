async function loadRoutes() {
  try {
    const response = await fetch('/api-docs');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const routesData = await response.json();

    const apiList = document.getElementById('apiList');
    if (!apiList) {
      throw new Error("Cannot find element #apiList in HTML");
    }
    apiList.innerHTML = '';

    Object.keys(routesData).forEach(groupName => {
      const groupHeader = document.createElement('h2');
      groupHeader.textContent = groupName.toUpperCase();
      apiList.appendChild(groupHeader);

      routesData[groupName].forEach(route => {
        const item = document.createElement('div');
        item.className = 'api-item';

        let exampleHtml = '';
        if (route.example.request) {
          const requestJson = JSON.stringify(route.example.request, null, 2);
          const encodedRequestJson = encodeURIComponent(requestJson);
          exampleHtml += `
              <div class="example">
                <i class="fas fa-copy copy-icon" data-copy="${encodedRequestJson}" title="Copy to clipboard"></i>
                <pre>${requestJson}</pre>
              </div>
            `;
        }
        if (route.example.request1) {
          const responseJson = JSON.stringify(route.example.request1, null, 2);
          const encodedResponseJson = encodeURIComponent(responseJson);
          exampleHtml += `
              <div class="example">
                 <i class="fas fa-copy copy-icon" data-copy="${encodedResponseJson}" title="Copy to clipboard"></i>
                <pre>${responseJson}</pre>
              </div>
            `;
        }

        if (route.example.response) {
          const responseJson = JSON.stringify(route.example.response, null, 2);
          const encodedResponseJson = encodeURIComponent(responseJson);
          exampleHtml += `
              <div class="example">
                 <i class="fas fa-copy copy-icon" data-copy="${encodedResponseJson}" title="Copy to clipboard"></i>
                <pre>${responseJson}</pre>
              </div>
            `;
        }
        if (route.example.note) {
          exampleHtml += `<p>${route.example.note}</p>`;
        }

        const authHtml = route.needsAuthorization
          ? '<span class="auth-required">Requires Admin</span>'
          : '';

        const authHtmlToken = route.needsAuthorizationUser
          ? '<span class="auth-required">Requires Authorization</span>'
          : '';

        item.innerHTML = `
            <span class="method ${route.method.toLowerCase()}">${route.method}</span>
            <span class="endpoint">${route.path}</span>
            ${authHtml}
            ${authHtmlToken}
            ${exampleHtml}
          `;

        apiList.appendChild(item);
      });
    });

    document.querySelectorAll('.copy-icon').forEach(icon => {
      icon.addEventListener('click', async () => {
        const encodedTextToCopy = icon.getAttribute('data-copy');
        const textToCopy = decodeURIComponent(encodedTextToCopy);

        try {
          await navigator.clipboard.writeText(textToCopy);
          icon.classList.remove('fa-copy');
          icon.classList.add('fa-check');
          setTimeout(() => {
            icon.classList.remove('fa-check');
            icon.classList.add('fa-copy');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

window.onload = loadRoutes;