import os
import sys

from api.correctness.aqusa.corefiles.analyzer import *
from api.correctness.aqusa.corefiles.globals import *
from api.correctness.aqusa.corefiles.stories import *
from api.correctness.aqusa.corefiles.wellformed import *


def getConnextra(fileText):
    defects.clear()
    allStories = Stories(None)
    init_format("txt")

    i = 0
    for r in fileText:
        i = i + 1
        if r.strip() == "":
            continue
        story = Story(id=i, title=r.strip())
        story = story.chunk()
        WellFormedAnalyzer.well_formed(story)
        Analyzer.atomic(story)
        MinimalAnalyzer.minimal(story)
        allStories.add_story(story)

    allStories = Analyzer.get_common_format(allStories)

    for story in allStories.stories:
        Analyzer.uniform(story, allStories)

    output_dict = {}
    for defect in defects:
        output_dict.update({defect.story_id: defect.print_txt()})

    return output_dict
