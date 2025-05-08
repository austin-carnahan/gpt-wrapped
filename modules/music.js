export async function renderMoodMusic(targetSel, mood = 'happy') {
    const section = document.querySelector(targetSel);
    if (!section) return;
    section.innerHTML = '';
  
    const heading = document.createElement('h2');
    heading.textContent = '🎵 Mood-Based Music';
    section.appendChild(heading);
  
    // Mocked genre-based mapping
    const genreMap = {
      happy: 'pop',
      sad: 'blues',
      energetic: 'rock',
      relaxed: 'lofi'
    };
  
    const selectedGenre = genreMap[mood.toLowerCase()] || 'pop';
  
    // Stubbed demo list (replace with live API later)
    const tracks = [
      { title: 'Sunlight', artist: 'Artist A', url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3' },
      { title: 'Vibes Only', artist: 'Artist B', url: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3' }
    ];
  
    const wrapper = document.createElement('div');
    wrapper.className = 'music-box';
    wrapper.style.maxWidth = '600px';
    wrapper.style.margin = '0 auto';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '1.5rem';
    wrapper.style.marginTop = '1rem';
  
    tracks.forEach(track => {
      const card = document.createElement('div');
      card.style.background = '#1a1a1a';
      card.style.padding = '1rem';
      card.style.borderRadius = '0.75rem';
      card.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
  
      const title = document.createElement('p');
      title.innerHTML = `<strong>${track.title}</strong> by ${track.artist}`;
      title.style.marginBottom = '0.5rem';
      title.style.color = '#e5e7eb';
      card.appendChild(title);
  
      const audio = document.createElement('audio');
      audio.src = track.url;
      audio.controls = true;
      audio.style.width = '100%';
      card.appendChild(audio);
  
      wrapper.appendChild(card);
    });
  
    section.appendChild(wrapper);
  }
  