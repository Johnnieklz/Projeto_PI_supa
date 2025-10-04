// ... existing code ...
const injectVLibrasContainer = () => {
  // Remove container existente, se houver
  const existingContainer = document.querySelector('div[vw="true"]');
  if (existingContainer) {
    existingContainer.remove();
  }

  // Cria o container principal
  const container = document.createElement('div');
  container.setAttribute('vw', 'true');
  container.className = 'enabled';
  container.style.cssText = 'position: fixed !important; z-index: 99999 !important; right: 0 !important; top: 40% !important; display: block !important; visibility: visible !important;';

  // Cria o botão de acesso
  const button = document.createElement('div');
  button.setAttribute('vw-access-button', 'true');
  button.className = 'active';
  button.style.cssText = 'display: block !important; visibility: visible !important;';
  container.appendChild(button);

  // Cria o wrapper do plugin
  const wrapper = document.createElement('div');
  wrapper.setAttribute('vw-plugin-wrapper', 'true');
  wrapper.style.cssText = 'display: block !important; visibility: visible !important;';
  container.appendChild(wrapper);

  // Adiciona ao body
  document.body.appendChild(container);
  return container;
};
// ... existing code ...