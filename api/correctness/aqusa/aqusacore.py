import os
import sys
import getopt
import django

from api.correctness.aqusa.corefiles.wellformed import *
from api.correctness.aqusa.corefiles.analyzer import *
from api.correctness.aqusa.corefiles.globals import *
from api.correctness.aqusa.corefiles.stories import *
from argparse import ArgumentParser


def getConnextra(inputfilePath, outputfile='', outputformat="txt"):
    print('======================================================\n' +
          '                     AQUSA-Core\n' +
          '    Requirements Engineering Lab, Utrecht University\n' +
          '           Fabiano Dalpiaz, Garm Lucassen\n' +
          '======================================================\n')

    if os.path.exists(inputfilePath):
        with open(inputfilePath) as f:
            raw = f.readlines()
    else:
        print('The input file "input/' + inputfilePath + '" does not exist')
        sys.exit(2)

    allStories = Stories(None)
    init_format(outputformat)

    i = 0
    for r in raw:
        i = i + 1
        if r.strip() == "":
            continue
        story = Story(id=i, title=r.strip())
        story = story.chunk()
        WellFormedAnalyzer.well_formed(story)
        Analyzer.atomic(story)
        MinimalAnalyzer.minimal(story)
        Analyzer.unique(story, allStories)
        allStories.add_story(story)

    allStories = Analyzer.get_common_format(allStories)

    for story in allStories.stories:
        Analyzer.uniform(story, allStories)

    output_text = ""
    output_array = []

    if outputformat == 'html':
        with tag('html'):
            with tag('head'):
                with tag('script', src='sorttable.js', type='text/javascript'):
                    pass
                with tag('link', rel='stylesheet', href='styles.css'):
                    pass
            with tag('body'):
                with tag('table', klass='sortable'):
                    with tag('thead'):
                        with tag('tr'):
                            with tag('th'):
                                text('ID')
                            with tag('th'):
                                text('User Story')
                            with tag('th'):
                                text('Defect kind')
                            with tag('th'):
                                text('Subkind')
                            with tag('th'):
                                text('Message')
                    with tag('tbody'):
                        for defect in defects:
                            defect.print_html(doc, tag, text)
        output_text = doc.getvalue()
    else:
        for defect in defects:
            # output_text = output_text + defect.print_txt()
            output_array.append(defect.print_txt())

    if outputfile == '':
        # return output_text
        return output_array
    else:
        f = open("output/" + outputfile + "." + outputformat, "w")
        f.write(output_text)
