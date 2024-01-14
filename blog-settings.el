  (defun noumena-journal-today ()
    "Create an org mode journal entry or jump to existing index.org."
    (interactive)
    (let* ((current-date (format-time-string "%B %e, %Y"))
           (year (format-time-string "%Y"))
           (month-name (downcase (format-time-string "%B")))
           (day-number (format-time-string "%d"))
           (year-directory (expand-file-name year "~/org/blog/noumena"))
           (month-directory (expand-file-name month-name year-directory))
           (day-directory (expand-file-name day-number month-directory))
           (file-path (expand-file-name "index.org" day-directory))
           (header-line (format "#+INCLUDE: %s\n" "~/org/blog/noumena/header.org"))
           (image-preview-line (format "#+INCLUDE: %s\n" "~/org/blog/image-preview-header.org"))
           (image-path (format "https://joshua-wood.dev/noumena/%s/%s/%s/"
                               year month-name day-number))
           )

      ;; Create the year directory if it doesn't exist
      (unless (file-directory-p year-directory)
        (make-directory year-directory t))

      ;; Create the month directory if it doesn't exist
      (unless (file-directory-p month-directory)
        (make-directory month-directory t))

      ;; Create the day directory if it doesn't exist
      (unless (file-directory-p day-directory)
        (make-directory day-directory t))

      ;; Check if index.org file exists
      (if (file-exists-p file-path)
          ;; If it exists, open the file
          (find-file file-path)
        ;; If it doesn't exist, create the index.org file
        (with-temp-file file-path
          ;; Write the #+TITLE header
          (insert (format "#+TITLE: %s\n" current-date))
          ;; Write the #+INCLUDE lines
          (insert header-line)
          (insert image-preview-line)
          ;; Insert a blank line
          (insert "\n")
          ;; Write the additional lines
          (insert (format "#+HTML_HEAD_EXTRA:<meta property=\"og:image\" content=\"%s\">\n" image-path))
          (insert (format "#+HTML_HEAD_EXTRA:<meta property=\"og:image:alt\" content=\"%s alt\"/>\n" current-date))
          (insert "#+HTML_HEAD_EXTRA:<meta property=\"og:description\" content=\"\">\n")
          (insert (format "#+HTML_HEAD_EXTRA:<meta name=\"twitter:image\" content=\"%s\" />\n" image-path))
          )
        (find-file file-path)
        )))


(defun open-journal-entry ()
  "Open the default browser to the current journal entry path."
  (interactive)
  (let* ((file-path (buffer-file-name))
         (journal-regexp "^/home/[^/]+/org/blog/noumena/\\([0-9]+\\)/\\(.+\\)/\\([0-9]+\\)/index\\.org$")
         (match (and file-path (string-match journal-regexp file-path)))
         (url-prefix "https://joshua-wood.dev/noumena/"))

    (if match
        (let ((year (match-string 1 file-path))
              (month (match-string 2 file-path))
              (day (match-string 3 file-path)))
          (browse-url (concat url-prefix year "/" month "/" day)))
      (message "Not a journal entry."))))

(defun insert-video-container ()
  "Inserts a video container HTML block."
  (interactive)
  (insert "#+begin_export html\n")
  (insert "<div class=\"video-container\">\n\n")
  (insert "</div>\n")
  (insert "#+end_export\n")
  (forward-line -3))

(spacemacs/set-leader-keys-for-major-mode 'org-mode "iv" 'insert-video-container)

(defun generate-html-calendar ()
  "Generate an HTML calendar with dynamically calculated offset and number of days."
  (interactive)
  (let* ((weekdays '("Sun" "Mon" "Tue" "Wed" "Thu" "Fri" "Sat"))
         (current-date (decode-time (current-time)))
         (current-month (nth 4 current-date))
         (current-year (nth 5 current-date))
         (first-day-of-month (decode-time (apply 'encode-time `(0 0 0 1 ,current-month ,current-year))))
         (offset (mod (+ (nth 6 first-day-of-month) 1) 7))
         (num-days (calendar-last-day-of-month current-month current-year))
         (calendar-html ""))

    ;; Generate the weekdays div
    (setq calendar-html "<div class=\"weekdays\">\n")
    (dolist (day weekdays)
      (setq calendar-html (concat calendar-html "  <span>" day "</span>\n")))
    (setq calendar-html (concat calendar-html "</div>\n<br>\n"))

    ;; Generate the calendar div
    (setq calendar-html (concat calendar-html "<div class=\"calendar\">\n"))

    ;; Generate blank spaces based on the starting day of the month
    (dotimes (i offset)
      (setq calendar-html (concat calendar-html "  <span></span>\n")))

    ;; Generate anchor tags with numbers 1-num-days
    (dotimes (i num-days)
      (setq day (+ i 1))
      (setq calendar-html (concat calendar-html "  <a>" (number-to-string day) "</a>"))
      (setq calendar-html (if (= (% (+ i 1 offset) 7) 0) (concat calendar-html "\n") (concat calendar-html " "))))

    (setq calendar-html (concat calendar-html "</div>"))

    ;; Insert the generated HTML into the buffer
    (insert calendar-html)))

(defun insert-half-width-images ()
  "Inserts an Org-mode block with two images, each set to 50% width."
  (interactive)
  (insert "#+begin_export html\n")
  (insert "<div class=\"figure\">\n")
  (insert "<p style=\"display: flex; margin-bottom: 0; padding-bottom: 0;\">\n")
  (insert "<img src=\"\" width=\"50%\">\n")
  (insert "<img src=\"\" width=\"50%\">\n")
  (insert "</p>\n")
  (insert "</div>\n")
  (insert "#+end_export\n")
  (previous-line 6)
  (end-of-line)
  (backward-char 17))

(spacemacs/declare-prefix "jt" "Jump to")
(spacemacs/set-leader-keys "jtn" 'noumena-journal-today)
(spacemacs/declare-prefix "jtn" "Noumena Journal Entry Today")
(spacemacs/set-leader-keys "jtt" 'jump-to-todos)
(spacemacs/declare-prefix "jtt" "Todos")
