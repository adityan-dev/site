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
       (list "my-org-site"
             :recursive t
             :base-directory "./content"
             :publishing-directory "./public"
             :publishing-function 'org-html-publish-to-html
	     :with-author nil           
             :with-creator nil
             :with-toc t
	     :section-numbers nil
	     :time-stamp-file nil)))

(setq org-html-validation-link nil
      org-html-head-include-scripts nil
      org-html-head-include-default-style nil)

(org-publish-all t)
(message "Build complete!")

