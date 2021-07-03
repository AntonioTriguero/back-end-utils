import numpy as np

def item_probabily(distribution: np.array, elem):
	unique, counts = numpy.unique(distribution, return_counts=True)
	counts = dict(zip(unique, counts))
	return counts[elem] / distribution.shape[0]
