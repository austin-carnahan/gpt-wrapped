export async function renderMeme(targetSel) {
    const section = document.querySelector(targetSel);
    if (!section) return;
    section.innerHTML = '';
  
    const heading = document.createElement('h2');
    heading.textContent = '😂 Meme of the Day';
    section.appendChild(heading);
  
    try {
      const res = await fetch("https://meme-api.com/gimme");
      const data = await res.json();
  
      const wrapper = document.createElement('div');
      wrapper.style.maxWidth = '480px';
      wrapper.style.margin = '0 auto';
      wrapper.style.backgroundColor = '#1a1a1a';
      wrapper.style.borderRadius = '0.75rem';
      wrapper.style.padding = '1rem';
      wrapper.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
      wrapper.style.textAlign = 'center';
  
      const title = document.createElement('p');
      title.textContent = data.title;
      title.style.color = '#e5e7eb';
      title.style.marginBottom = '0.75rem';
      title.style.fontWeight = 'bold';
      wrapper.appendChild(title);
  
      const img = document.createElement('img');
      img.src = data.url;
      img.alt = 'Meme';
      img.style.width = '100%';
      img.style.borderRadius = '0.5rem';
      wrapper.appendChild(img);
  
      section.appendChild(wrapper);
    } catch (err) {
      console.error('❌ Failed to load meme:', err);
      const error = document.createElement('p');
      error.textContent = 'Oops! Meme failed to load.';
      error.style.color = 'red';
      section.appendChild(error);
    }
  }
  