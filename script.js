// مدیریت مودال‌ها
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', () => {
        const modalId = box.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

document.querySelectorAll('.close-top').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            pauseMedia();
        }
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
        pauseMedia();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            pauseMedia();
        });
    }
});

// مدیریت فیلترها
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.box').forEach(box => {
            if (filter === 'all' || box.dataset.type === filter) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });
});

// مدیریت پخش‌کننده حرفه‌ای
const player = {
    audio: new Audio(),
    video: null,
    currentMedia: null,
    isPlaying: false,
    playBtn: document.getElementById('play-pause'),
    seekBar: document.querySelector('.player-seek'),
    volumeBar: document.querySelector('.player-volume'),
    title: document.querySelector('.player-title'),
    duration: document.querySelector('.player-duration'),
    thumb: document.querySelector('.player-thumb')
};

function playMedia(src, type, title, thumbSrc) {
    if (player.currentMedia !== src) {
        pauseMedia();
        if (type === 'audio') {
            player.audio.src = src;
            player.currentMedia = player.audio;
        } else {
            player.video = document.querySelector(`video[data-media-id="${src.split('.')[0]}"]`);
            player.currentMedia = player.video;
        }
        player.currentMedia = src;
        player.title.textContent = `در حال پخش: ${title}`;
        player.thumb.src = thumbSrc;
    }
    player.currentMedia.play();
    player.isPlaying = true;
    player.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
}

function pauseMedia() {
    if (player.audio) player.audio.pause();
    if (player.video) player.video.pause();
    player.isPlaying = false;
    player.playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
}

player.playBtn.addEventListener('click', () => {
    if (player.isPlaying) {
        pauseMedia();
    } else if (player.currentMedia) {
        player.currentMedia.play();
        player.isPlaying = true;
        player.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    }
});

player.seekBar.addEventListener('input', () => {
    const time = (player.seekBar.value / 100) * player.currentMedia.duration;
    player.currentMedia.currentTime = time;
});

player.volumeBar.addEventListener('input', () => {
    player.currentMedia.volume = player.volumeBar.value / 100;
});

player.audio.addEventListener('timeupdate', () => {
    const current = player.audio.currentTime;
    const duration = player.audio.duration;
    player.seekBar.value = (current / duration) * 100;
    player.duration.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// اتصال آیتم‌های مودال به پلیر
document.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('click', () => {
        const src = item.dataset.src;
        const type = item.dataset.type;
        const title = item.textContent;
        const thumbSrc = document.querySelector('.box img').src; // فرضیه برای تصویر
        playMedia(src, type, title, thumbSrc);
    });
});