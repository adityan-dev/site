(require 'package)
(setq package-user-dir (expand-file-name "./.packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))

(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

(package-install 'htmlize)

(require 'ox-publish)

(setq org-publish-project-alist
      (list
       ;; This part converts your .org files to .html
       (list "site-org"
             :recursive t
             :base-directory "./content"
             :publishing-directory "./public"
             :publishing-function 'org-html-publish-to-html
             :with-author nil
             :with-creator nil
             :with-toc t
             :section-numbers nil
             :time-stamp-file nil)

       ;; NEW PART: This copies all other files (css, jpg, png, etc.)
       (list "site-static"
             :recursive t
             :base-directory "./content"
             :publishing-directory "./public"
             :publishing-function 'org-publish-attachment
             ;; Exclude Org files, which are handled by the first component
             :exclude "\\.org$")

       ;; This combines the two components above into a single project
       (list "site" :components '("site-org" "site-static"))))

(setq org-html-validation-link nil
      org-html-head-include-scripts nil
      org-html-head-include-default-style nil)

(org-publish "site" t)
(message "Build complete!")

