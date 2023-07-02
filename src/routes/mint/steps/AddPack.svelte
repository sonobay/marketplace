<script lang="ts">
	import BlueBox from '$lib/components/boxes/BlueBox.svelte';
	import BlueButton from '$lib/components/buttons/BlueButton.svelte';
	import YellowButton from '$lib/components/buttons/YellowButton.svelte';
	import Tag from '../components/Tag.svelte';
	import TagInput from '$lib/components/inputs/TagInput.svelte';
	import { mint } from '$lib/stores/mint';
	import Input from '$lib/components/inputs/Input.svelte';
	import TextArea from '$lib/components/inputs/TextArea.svelte';
	import { isPositiveInteger } from '$lib/utils';
	import ImageInput from '$lib/components/inputs/ImageInput.svelte';
	import { fade } from 'svelte/transition';

	export let nextAction = () => {};
	export let previousAction = () => {};

	$: done =
		$mint.description.length > 0 &&
		$mint.packName.length > 0 &&
		$mint.amountToMint > 0 &&
		$mint.packTags.length > 0 &&
		$mint.image != undefined;

	function addTag(tag: string) {
		if (tag.length == 0 || tag.trim().length == 0) return;
		if ($mint.packTags.length >= 5) return;
		if ($mint.packTags.includes(tag)) return;
		$mint.packTags.push(tag);
		$mint.packTags = $mint.packTags;
	}
	function removeTag(tag: string) {
		$mint.packTags = $mint.packTags.filter((t) => t != tag);
	}
	function validateMintAmountInput(input: string) {
		if (isPositiveInteger(input)) $mint.amountToMint = parseInt(input);
		else $mint.amountToMint = 0;
	}
	function validateNameInput(input: string) {
		$mint.packName = input;
	}
	function validateDescription(input: string) {
		$mint.description = input;
	}
</script>

<div in:fade class="min-h-[365px]">
	<BlueBox>
		<div class="flex lg:flex-row flex-col items-center md:items-start gap-6">
			<ImageInput
				image={$mint.image}
				id="pack-logo"
				on:imageUpdated={(e) => {
					if (e.detail.files != undefined) {
						$mint.image = e.detail.files[0];
					}
				}}
			/>

			<div class="w-full lg:w-4/5">
				<div class="w-full">
					<div class="flex lg:flex-row flex-col lg:items-center gap-4 mb-4">
						<div class="lg:w-3/4">
							<Input
								value={$mint.packName.length > 0 ? $mint.packName : ''}
								placeholder="Pack name"
								max={40}
								onInputAction={validateNameInput}
							/>
						</div>
						<div class="lg:w-1/4">
							<Input
								value={$mint.amountToMint > 0 ? $mint.amountToMint.toString() : ''}
								number={true}
								placeholder="# To Mint"
								max={4}
								min={1}
								onInputAction={validateMintAmountInput}
							/>
						</div>
					</div>
					<TextArea
						value={$mint.description.length > 0 ? $mint.description : ''}
						placeholder="Description"
						onInputAction={validateDescription}
					/>
					<div class="mt-4 lg:w-60">
						<TagInput placeholder="Tags" action={addTag} />
					</div>
				</div>

				<div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
					{#each $mint.packTags as tag}
						<Tag text={tag} action={removeTag} />
					{/each}
				</div>
			</div>
		</div>
	</BlueBox>
</div>

<div class="flex justify-end mt-12 gap-4">
	<YellowButton text="BACK" action={previousAction} />
	<BlueButton text="NEXT" action={nextAction} disabled={!done} />
</div>
