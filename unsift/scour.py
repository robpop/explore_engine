def containsCode(untrustedFile):
	keywords = ['<html', '<script', '</script>', 'javascript', 'eval(', 'document.write(', '<iframe', '<head', '<body', '<link', 'href', 'stylesheet', '<style', '</style', 'text/css']
	totalFound = 0
	previousFound = 0
	previousChunk = ''
	for chunk in untrustedFile.chunks(chunk_size=1024):
		chunk = str(chunk)
		# Reset current and combined found
		currentFound = 0
		combinedFound = 0
		# Main check for current chunk
		for keyword in keywords:
			if keyword in chunk:
				currentFound += chunk.count(keyword)
		# Ensures secondary check doesn't run on first iteration
		if previousChunk != '':
			# Combines previous and current chunk to check for keywords split between them
			combinedChunks = previousChunk + chunk
			for keyword in keywords:
				if keyword in combinedChunks:
					combinedFound += combinedChunks.count(keyword)
			# if there are more keywords in the combined chunks than the sum of the two then there was a keyword between chunks
			if combinedFound > (previousFound + currentFound):
				totalFound += 1
		totalFound += currentFound
		previousChunk = chunk
		previousFound = currentFound
	if totalFound >= 2:
		return True
	else:
		return False