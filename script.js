const checklist = [
    { doTask: "ورزش صبحگاهی انجام بده (مثل 10 دقیقه پیاده‌روی)", dontTask: "تا لنگ ظهر نخواب", selected: null },
    { doTask: "با دوستانت معاشرت کن (حتی تلفنی)", dontTask: "خودت رو منزوی نکن", selected: null },
    { doTask: "10 دقیقه مدیتیشن یا تنفس عمیق کن", dontTask: "گوشی رو به تخت نبر", selected: null },
    { doTask: "هدف روزانه بنویس (مثلاً مطالعه یا کدنویسی)", dontTask: "گوشی رو اول صبح چک نکن", selected: null },
    { doTask: "30 دقیقه فعالیت بدنی داشته باش", dontTask: "به محتوای تحریک‌کننده نگاه نکن", selected: null },
    { doTask: "روتین خواب منظم (7-8 ساعت) داشته باش", dontTask: "تا دیروقت بیدار نمون", selected: null },
    { doTask: "یه سرگرمی جدید امتحان کن (مثل نقاشی)", dontTask: "وقتت رو با شبکه‌های اجتماعی تلف نکن", selected: null },
    { doTask: "یه لیوان آب بنوش وقتی وسوسه شدی", dontTask: "توی موقعیت‌های وسوسه‌انگیز نمون", selected: null },
    { doTask: "پیشرفتت رو توی دفترچه بنویس", dontTask: "خودت رو سرزنش نکن", selected: null },
    { doTask: "با یه مشاور یا دوست مورد اعتماد حرف بزن", dontTask: "احساساتت رو سرکوب نکن", selected: null }
];

// گرفتن تاریخ فعلی (میلادی)
function getCurrentDate() {
    const now = new Date("2025-08-22T12:05:00+04:00"); // به‌روز با زمان فعلی
    return now.toISOString().split('T')[0]; // مثلاً 2025-08-22
}

// نمایش چک‌لیست با رادیو باتن
function showChecklist() {
    console.log("Starting showChecklist..."); // دیباگ
    const checklistElement = document.getElementById('checklist');
    if (!checklistElement) {
        console.error("Checklist element (#checklist) not found in HTML!");
        return;
    }
    console.log("Checklist element found, starting render...");
    checklistElement.innerHTML = '';
    checklist.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="form-check">
                <input type="radio" class="form-check-input" name="choice-${index}" id="do-${index}" ${item.selected === 'do' ? 'checked' : ''} onchange="updateChecklist(${index}, 'do')">
                <label class="form-check-label" for="do-${index}">بکن: ${item.doTask}</label>
            </div>
            <div class="form-check">
                <input type="radio" class="form-check-input" name="choice-${index}" id="dont-${index}" ${item.selected === 'dont' ? 'checked' : ''} onchange="updateChecklist(${index}, 'dont')">
                <label class="form-check-label" for="dont-${index}">نکن: ${item.dontTask}</label>
            </div>
        `;
        checklistElement.appendChild(li);
        console.log(`Rendered item ${index}: ${item.doTask}, ${item.dontTask}`);
    });
    console.log("Checklist rendering completed.");
}

// آپدیت چک‌لیست (فقط یه گزینه)
function updateChecklist(index, type) {
    console.log(`Updating item ${index} to ${type}`); // دیباگ
    checklist[index].selected = type;
}

// ذخیره چک‌لیست
function saveChecklist() {
    const date = getCurrentDate();
    let completedCount = 0;
    checklist.forEach(item => {
        if (item.selected) completedCount++;
    });
    const successRate = (completedCount / checklist.length * 100).toFixed(2);
    const data = { miladi: date, checklist: [...checklist], successRate };
    let history = JSON.parse(localStorage.getItem('checklist_history')) || [];
    history = history.filter(item => item.miladi !== date);
    history.push(data);
    localStorage.setItem('checklist_history', JSON.stringify(history));
    document.getElementById('success-rate').textContent = `نرخ موفقیت: ${successRate}%`;
    alert('چک‌لیست ذخیره شد!');
}

// نمایش تاریخچه
function showHistory() {
    const miladiInput = document.getElementById('history-date').value;
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';
    if (!miladiInput) {
        historyList.innerHTML = '<li class="list-group-item text-danger">لطفاً تاریخ را انتخاب کنید!</li>';
        return;
    }
    const history = JSON.parse(localStorage.getItem('checklist_history')) || [];
    const entry = history.find(item => item.miladi === miladiInput);
    if (entry) {
        entry.checklist.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                بکن: ${item.doTask} [${item.selected === 'do' ? '✅' : '⬜'}]<br>
                نکن: ${item.dontTask} [${item.selected === 'dont' ? '✅' : '⬜'}]
            `;
            historyList.appendChild(li);
        });
        historyList.innerHTML += `<li class="list-group-item fw-bold">نرخ موفقیت: ${entry.successRate}%</li>`;
    } else {
        historyList.innerHTML = '<li class="list-group-item text-warning">هیچ چک‌لیستی برای این تاریخ وجود ندارد!</li>';
    }
}

// فعال کردن اعلان
function enableNotifications() {
    if (!("Notification" in window)) {
        alert("مرورگر شما اعلان را پشتیبانی نمی‌کند!");
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("اعلان فعال شد! هر روز صبح ساعت ۸ یادآوری می‌کنید.");
            setInterval(() => {
                const now = new Date("2025-08-22T12:05:00+04:00");
                if (now.getHours() === 8 && now.getMinutes() === 0) {
                    new Notification("StepUp - یادآوری روزانه", {
                        body: "چک‌لیست امروزت رو تیک بزن و به هدفت نزدیک‌تر شو! 🚀"
                    });
                }
            }, 60000);
        }
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing app..."); // دیباگ
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = getCurrentDate();
        console.log("Current date set to:", getCurrentDate());
    } else {
        console.error("Current-date element not found!");
    }
    showChecklist();
});
