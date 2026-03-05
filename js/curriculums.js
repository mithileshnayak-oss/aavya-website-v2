// Curriculum Page — 7-Day Journey + Progress Tracking

var PROGRESS_KEY = 'aavya_7day_progress';

// ─── localStorage helpers ─────────────────────────────────
function getCompleted() {
    try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')); }
    catch(e) { return new Set(); }
}
function saveCompleted(completed) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(completed)));
}

// ─── Apply visual state to a single card ─────────────────
function applyCardState(card, isComplete) {
    var btn = card.querySelector('.btn-mark-complete');
    if (!btn) return;
    if (isComplete) {
        card.classList.add('card-completed');
        btn.textContent = '\u2713 Completed';
        btn.classList.add('is-complete');
    } else {
        card.classList.remove('card-completed');
        btn.textContent = 'Mark Complete';
        btn.classList.remove('is-complete');
    }
}

// ─── Update overall bar + day pills + timeline circles ────
function updateAllIndicators(completed) {
    var total = 19;
    var count = completed.size;
    var pct = Math.round((count / total) * 100);

    var fill = document.getElementById('overall-fill');
    var countEl = document.getElementById('overall-count');
    var pctEl = document.getElementById('overall-pct');
    if (fill) fill.style.width = pct + '%';
    if (countEl) countEl.textContent = count + ' of ' + total + ' courses complete';
    if (pctEl) pctEl.textContent = pct + '% complete';

    // Per-day pills and timeline circles
    var daySections = document.querySelectorAll('.day-section');
    for (var i = 0; i < daySections.length; i++) {
        var section = daySections[i];
        var dayId = section.id;
        var cards = section.querySelectorAll('.course-card');
        var dayTotal = cards.length;
        var dayDone = 0;
        for (var j = 0; j < cards.length; j++) {
            if (completed.has(cards[j].getAttribute('data-course-id'))) dayDone++;
        }

        var pill = document.getElementById(dayId + '-progress');
        if (pill) {
            pill.querySelector('.day-progress-done').textContent = dayDone;
            if (dayDone === dayTotal) {
                pill.classList.add('day-complete');
            } else {
                pill.classList.remove('day-complete');
            }
        }

        var dayNum = dayId.replace('day-', '');
        var circle = document.querySelector('.journey-day[data-day="' + dayNum + '"]');
        if (circle) {
            if (dayDone === dayTotal) {
                circle.classList.add('day-done');
            } else {
                circle.classList.remove('day-done');
            }
        }
    }
}

// ─── Toggle a course (called from onclick in HTML) ────────
function toggleCourse(courseId) {
    var completed = getCompleted();
    if (completed.has(courseId)) {
        completed.delete(courseId);
    } else {
        completed.add(courseId);
    }
    saveCompleted(completed);
    var card = document.querySelector('.course-card[data-course-id="' + courseId + '"]');
    if (card) applyCardState(card, completed.has(courseId));
    updateAllIndicators(completed);
}

// ─── Reset all progress ───────────────────────────────────
function resetProgress() {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    localStorage.removeItem(PROGRESS_KEY);
    var cards = document.querySelectorAll('.course-card');
    for (var i = 0; i < cards.length; i++) {
        applyCardState(cards[i], false);
    }
    updateAllIndicators(new Set());
}

// ─── On page load ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Restore saved progress
    var completed = getCompleted();
    var cards = document.querySelectorAll('.course-card');
    for (var i = 0; i < cards.length; i++) {
        var cid = cards[i].getAttribute('data-course-id');
        applyCardState(cards[i], completed.has(cid));
    }
    updateAllIndicators(completed);

    // Wire up Mark Complete buttons
    var markBtns = document.querySelectorAll('.btn-mark-complete');
    for (var b = 0; b < markBtns.length; b++) {
        markBtns[b].addEventListener('click', function () {
            var card = this.closest('.course-card');
            var courseId = card.getAttribute('data-course-id');
            toggleCourse(courseId);
        });
    }

    // Reset button
    var resetBtn = document.getElementById('btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetProgress);

    // ─── Journey timeline click → scroll to day ──────────
    var journeyDays = document.querySelectorAll('.journey-day');
    var daySections = document.querySelectorAll('.day-section');

    for (var d = 0; d < journeyDays.length; d++) {
        journeyDays[d].addEventListener('click', function () {
            var dayNum = this.getAttribute('data-day');
            var target = document.getElementById('day-' + dayNum);
            for (var k = 0; k < journeyDays.length; k++) journeyDays[k].classList.remove('active');
            this.classList.add('active');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Update active timeline circle on scroll
    var dayObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var dayNum = entry.target.id.replace('day-', '');
                for (var k = 0; k < journeyDays.length; k++) journeyDays[k].classList.remove('active');
                var active = document.querySelector('.journey-day[data-day="' + dayNum + '"]');
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

    daySections.forEach(function (s) { dayObserver.observe(s); });

    // ─── Course card scroll animation ────────────────────
    var courseCards = document.querySelectorAll('.course-card');
    var courseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                courseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    courseCards.forEach(function (card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease ' + (index % 3 * 0.1) + 's, transform 0.5s ease ' + (index % 3 * 0.1) + 's';
        courseObserver.observe(card);
    });
});
