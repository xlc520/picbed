# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# http://www.sphinx-doc.org/en/master/config

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import sys
from os.path import abspath, dirname, join
sys.path.insert(0, join(dirname(dirname(abspath(__file__))), "src"))
from version import __version__ as version

# -- Project information -----------------------------------------------------

project = 'sapic'
copyright = '2020, staugur'
author = 'staugur'
release = version

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinxcontrib.httpdomain',
    'sphinxcontrib.httpexample',
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

master_doc = 'index'
language = "zh_CN"
pygments_style = None

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = "press"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']
html_favicon = '_static/images/favicon.png'
html_logo = '_static/images/logo.png'
html_show_sourcelink = False

# -- Extension configuration -------------------------------------------------

html_theme_options = {
    'external_links': [
        ("Demo", "http://demo.picbed.pro"),
        ("GitHub", "https://github.com/sapicd/sapic"),
        ("Gitee", "https://gitee.com/staugur/picbed"),
    ],
}
#: fix ¶ #
html_add_permalinks = " "

autoclass_content = "both"
