import numpy as np

def item_probabily(observation: np.array, elem):
	unique, counts = numpy.unique(observation, return_counts=True)
	counts = dict(zip(unique, counts))
	return counts[elem] / observation.shape[0]
