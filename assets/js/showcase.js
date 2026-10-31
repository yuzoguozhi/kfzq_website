(function () {
	var shell = document.querySelector('.showcase-shell');
	if (!shell) return;

	var track = shell.querySelector('.showcase');
	if (!track) return;

	var cards = Array.prototype.slice.call(track.querySelectorAll('.showcase-card'));
	if (cards.length < 2) return;

	var nav = shell.querySelector('.showcase-nav');
	var dotsBox = nav ? nav.querySelector('.showcase-dots') : null;
	var prev = nav ? nav.querySelector('[data-showcase-prev]') : null;
	var next = nav ? nav.querySelector('[data-showcase-next]') : null;

	var dots = cards.map(function (card, i) {
		var dot = document.createElement('button');
		dot.type = 'button';
		dot.className = 'showcase-dot' + (i === 0 ? ' is-active' : '');
		dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
		dot.addEventListener('click', function () {
			go(i);
		});
		if (dotsBox) dotsBox.appendChild(dot);
		return dot;
	});

	function gapSize() {
		var style = window.getComputedStyle(track);
		return parseFloat(style.columnGap || style.gap) || 0;
	}

	function step() {
		return cards[0].getBoundingClientRect().width + gapSize();
	}

	function current() {
		var trackRect = track.getBoundingClientRect();
		var center = trackRect.left + trackRect.width / 2;
		var best = 0;
		var bestDistance = Infinity;
		cards.forEach(function (card, i) {
			var rect = card.getBoundingClientRect();
			var distance = Math.abs(rect.left + rect.width / 2 - center);
			if (distance < bestDistance) {
				bestDistance = distance;
				best = i;
			}
		});
		return best;
	}

	function sync() {
		var i = current();
		dots.forEach(function (dot, k) {
			dot.classList.toggle('is-active', k === i);
		});
		if (prev) prev.disabled = i <= 0;
		if (next) next.disabled = i >= cards.length - 1;
	}

	function go(i) {
		i = Math.max(0, Math.min(cards.length - 1, i));
		track.scrollTo({ left: i * step(), behavior: 'smooth' });
	}

	if (prev) prev.addEventListener('click', function () { go(current() - 1); });
	if (next) next.addEventListener('click', function () { go(current() + 1); });
	track.addEventListener('scroll', sync, { passive: true });

	var down = false;
	var dragging = false;
	var moved = false;
	var startX = 0;
	var startLeft = 0;
	var startIndex = 0;
	var dragDx = 0;

	track.addEventListener('pointerdown', function (e) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		down = true;
		dragging = false;
		moved = false;
		dragDx = 0;
		startX = e.clientX;
		startLeft = track.scrollLeft;
		startIndex = current();
	});

	track.addEventListener('pointermove', function (e) {
		if (!down) return;
		dragDx = e.clientX - startX;
		if (!dragging && Math.abs(dragDx) > 4) {
			dragging = true;
			moved = true;
			track.classList.add('is-dragging');
			if (track.setPointerCapture) {
				try { track.setPointerCapture(e.pointerId); } catch (err) {}
			}
		}
		if (dragging) track.scrollLeft = startLeft - dragDx;
	});

	function endDrag() {
		if (!down) return;
		down = false;
		dragging = false;
		track.classList.remove('is-dragging');
		if (moved) {
			var delta = Math.abs(dragDx) > 60 ? (dragDx < 0 ? 1 : -1) : 0;
			go(startIndex + delta);
		}
		dragDx = 0;
		window.setTimeout(function () { moved = false; }, 0);
	}

	track.addEventListener('pointerup', endDrag);
	track.addEventListener('pointercancel', endDrag);
	track.addEventListener('pointerleave', function (e) {
		if (down && e.buttons === 0) endDrag();
	});

	track.addEventListener('click', function (e) {
		if (moved) {
			e.preventDefault();
			e.stopPropagation();
			moved = false;
		}
	}, true);

	track.addEventListener('dragstart', function (e) { e.preventDefault(); });

	sync();
})();
